import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useState, useCallback } from "react";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import useFetch from "../../hook/useFetch";
import { COLORS, SIZES, icons } from "../../constants";

const tabs = ["About", "Qualtifications", "Responsibilities"];

const JobDetails = () => {
  const params = useSearchParams();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = () => {
    alert("refreshing");
  };
  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualtifications":
        return (
          <Specifics
            title="Qualifications"
            points={
              data[0].job_highlights?.Qualifications ?? [
                "No data provided by the Recruiter",
              ]
            }
          />
        );
      case "About":
        return (
          <JobAbout
            info={
              data[0].job_description ?? "No data provided by the Recruiter"
            }
          />
        );
      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={
              data[0].job_highlights?.Responsibilities ?? [
                "Not provided by the Recruiter",
              ]
            }
          />
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: "",
          headerTitleAlign: "center",
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : data.length === 0 ? (
            <Text>No data found</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
